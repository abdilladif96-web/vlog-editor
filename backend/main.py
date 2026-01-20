from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import os
import uuid
import subprocess
import tempfile
import shutil
from pathlib import Path
import json

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR = Path("outputs")
OUTPUT_DIR.mkdir(exist_ok=True)

@app.post("/upload")
async def upload_files(files: list[UploadFile] = File(...), session_id: str = Form(None)):
    if not session_id:
        session_id = str(uuid.uuid4())
    session_dir = UPLOAD_DIR / session_id
    session_dir.mkdir(exist_ok=True)
    
    input_files = []
    for file in files:
        file_path = session_dir / file.filename
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        input_files.append(str(file_path))
    
    return {"session_id": session_id, "input_files": input_files}

@app.post("/edit")
async def edit_vlog(session_id: str = Form(...), prompt: str = Form(...)):
    session_dir = UPLOAD_DIR / session_id
    if not session_dir.exists():
        raise HTTPException(404, "Session not found")
    
    input_files = list(session_dir.glob("*.mp4"))  # Assume MP4
    if not input_files:
        raise HTTPException(400, "No input files")
    
    # Simple prompt parsing (expand with LLM later)
    target_duration = 600  # 10 min default in seconds
    silence_threshold = "-silence_threshold -50dB" if "tight" in prompt.lower() else "-silence_threshold -30dB"
    silence_duration = "0.8" if "tight" in prompt.lower() else "1.2"
    
    output_path = OUTPUT_DIR / f"{session_id}_vlog.mp4"
    
    # FFmpeg: concat inputs, remove silences, trim to target
    concat_list = session_dir / "concat.txt"
    with open(concat_list, "w") as f:
        for fpath in input_files:
            # Escape single quotes in filename for ffmpeg concat
            safe_path = str(fpath.absolute()).replace("'", "'\\''")
            f.write(f"file '{safe_path}'\n")
    
    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list),
        "-af", f"silenceremove=1:{silence_duration}:{silence_threshold}",
        "-t", str(target_duration),
        "-c:v", "libx264", "-preset", "fast", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k",
        str(output_path)
    ]
    
    print(f"Running command: {' '.join(cmd)}")
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        print(f"FFmpeg error: {proc.stderr}")
        raise HTTPException(500, f"FFmpeg failed: {proc.stderr}")
    
    return {"output_url": f"/download/{output_path.name}", "session_id": session_id}

@app.get("/download/{filename}")
async def download(filename: str):
    file_path = OUTPUT_DIR / filename
    if not file_path.exists():
        raise HTTPException(404, "File not found")
    return StreamingResponse(open(file_path, "rb"), media_type="video/mp4")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
