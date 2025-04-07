import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
    private s3: S3;

    constructor() {
        this.s3 = new S3({
            endpoint: process.env.AWS_ENDPOINT,
            s3ForcePathStyle: true,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }

    async upload(file: Express.Multer.File): Promise<string> {
        const uploadParams: S3.Types.PutObjectRequest = {
            Bucket: process.env.AWS_BUCKETNAME || '',
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };

        return (await this.s3.upload(uploadParams).promise()).Location;
    }
}
