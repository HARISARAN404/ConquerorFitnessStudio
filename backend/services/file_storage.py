import json
import os
import aiofiles
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

class FileStorageService:
    def __init__(self, storage_path: str = "./storage"):
        self.storage_path = Path(storage_path)
        self.data_path = self.storage_path / "data"
        self.uploads_path = self.storage_path / "uploads"
        self.photos_path = self.uploads_path / "photos"

        # Create directories if they don't exist
        self.storage_path.mkdir(exist_ok=True)
        self.data_path.mkdir(exist_ok=True)
        self.uploads_path.mkdir(exist_ok=True)
        self.photos_path.mkdir(exist_ok=True)

    async def read_json(self, filename: str) -> Any:
        file_path = self.data_path / filename
        if not file_path.exists():
            return {} if filename.endswith('.json') else []

        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            content = await f.read()
            return json.loads(content) if content else [] if filename.endswith('.json') else {}

    async def write_json(self, filename: str, data: Any) -> None:
        file_path = self.data_path / filename
        async with aiofiles.open(file_path, 'w', encoding='utf-8') as f:
            await f.write(json.dumps(data, indent=2, ensure_ascii=False))

    async def save_photo(self, file_data: bytes, filename: str) -> str:
        file_path = self.photos_path / filename
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_data)

        # Return URL accessible by frontend
        return f"/uploads/photos/{filename}"

    def delete_photo(self, filename: str) -> bool:
        try:
            file_path = self.photos_path / filename
            if file_path.exists():
                file_path.unlink()
                return True
            return False
        except Exception:
            return False