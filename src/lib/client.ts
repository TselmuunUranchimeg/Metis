import { S3Client } from "@aws-sdk/client-s3";

const globalClient = global as unknown as { client: S3Client };

const param = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    },
    region: process.env.S3_REGION!
};

if (process.env.NODE_ENV === "production") {
    globalClient.client = new S3Client(param);
}

let client = globalClient.client || new S3Client(param);

export default client;