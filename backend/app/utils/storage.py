import uuid as _uuid
from fastapi import UploadFile, HTTPException

try:
    import boto3
    from botocore.exceptions import BotoCoreError, ClientError
    BOTO3_AVAILABLE = True
except ImportError:
    BOTO3_AVAILABLE = False

from app.config import settings

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic", "image/gif"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


def _get_s3_client():
    if not BOTO3_AVAILABLE:
        raise HTTPException(status_code=503, detail="Storage service not available.")
    return boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION,
    )


async def upload_file(file: UploadFile, folder: str) -> str:
    """Upload a file to S3/R2 and return its CDN URL."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400, detail=f"Unsupported file type: {file.content_type}"
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds 10 MB limit.")

    ext = (file.filename or "image.jpg").rsplit(".", 1)[-1].lower()
    key = f"{folder}/{_uuid.uuid4()}.{ext}"

    s3 = _get_s3_client()
    s3.put_object(
        Bucket=settings.AWS_S3_BUCKET,
        Key=key,
        Body=contents,
        ContentType=file.content_type,
        CacheControl="max-age=31536000",
    )

    return f"{settings.CDN_BASE_URL}/{key}"


def delete_file(url: str) -> None:
    """Delete a file from S3 given its CDN URL."""
    key = url.replace(f"{settings.CDN_BASE_URL}/", "")
    s3 = _get_s3_client()
    s3.delete_object(Bucket=settings.AWS_S3_BUCKET, Key=key)
