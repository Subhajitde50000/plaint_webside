import boto3
import uuid
from fastapi import UploadFile
from app.config import settings

s3_client = boto3.client(
    "s3",
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_S3_REGION,
)

ALLOWED_IMAGE_TYPES = {
    "image/jpeg", "image/png", "image/webp", "image/heic"
}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

async def upload_file(file: UploadFile, folder: str) -> str:
    """Upload file to S3/R2 and return CDN URL."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise ValueError(f"Unsupported file type: {file.content_type}")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise ValueError("File exceeds 10MB limit.")

    ext = file.filename.rsplit(".", 1)[-1].lower()
    key = f"{folder}/{uuid.uuid4()}.{ext}"

    s3_client.put_object(
        Bucket=settings.AWS_S3_BUCKET,
        Key=key,
        Body=contents,
        ContentType=file.content_type,
        CacheControl="max-age=31536000",  # 1 year CDN cache
    )

    return f"{settings.CDN_BASE_URL}/{key}"


def delete_file(url: str) -> None:
    """Delete file from S3 given its CDN URL."""
    key = url.replace(f"{settings.CDN_BASE_URL}/", "")
    s3_client.delete_object(Bucket=settings.AWS_S3_BUCKET, Key=key)