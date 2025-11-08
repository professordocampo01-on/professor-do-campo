from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from ..schemas import UploadMatchIn
from ..workers.tasks import process_match_payload
import json

router = APIRouter(prefix="/api")

@router.post("/upload-match")
async def upload_match(payload: UploadMatchIn):
    try:
        task = process_match_payload.delay(payload.dict())
        return {"status": "enfileirado", "task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        data = json.loads(contents)
        task = process_match_payload.delay(data)
        return {"status": "enfileirado", "task_id": task.id}
    except Exception:
        raise HTTPException(status_code=400, detail="Arquivo não é JSON válido ou parse falhou")
