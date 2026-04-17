"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = exports.CloudinaryFileService = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
class CloudinaryFileService {
    constructor({}, options) {
        this.options_ = options;
        cloudinary_1.v2.config({
            cloud_name: options.cloud_name,
            api_key: options.api_key,
            api_secret: options.api_secret,
        });
    }
    async upload(file) {
        const folder = this.options_.folder || 'tavilgaa-medusa';
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: 'auto' }, (error, result) => {
                if (error || !result)
                    return reject(error);
                resolve({ url: result.secure_url, key: result.public_id });
            });
            const buffer = Buffer.isBuffer(file.content)
                ? file.content
                : Buffer.from(file.content);
            stream.end(buffer);
        });
    }
    async delete(fileData) {
        await cloudinary_1.v2.uploader.destroy(fileData.fileKey);
    }
    async getPresignedDownloadUrl(fileData) {
        return cloudinary_1.v2.url(fileData.fileKey, { secure: true });
    }
    async getDownloadStream(fileData) {
        const url = cloudinary_1.v2.url(fileData.fileKey, { secure: true });
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const readable = new stream_1.Readable();
        readable.push(Buffer.from(buffer));
        readable.push(null);
        return readable;
    }
    async getAsBuffer(fileData) {
        const url = cloudinary_1.v2.url(fileData.fileKey, { secure: true });
        const response = await fetch(url);
        return Buffer.from(await response.arrayBuffer());
    }
    async getUploadStream(fileData) {
        const folder = this.options_.folder || 'tavilgaa-medusa';
        let resolveUpload;
        const promise = new Promise((resolve) => { resolveUpload = resolve; });
        const writeStream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: 'auto' }, (_, result) => {
            if (result)
                resolveUpload({ url: result.secure_url, key: result.public_id });
        });
        const publicId = `${folder}/${fileData.filename}`;
        const url = cloudinary_1.v2.url(publicId, { secure: true });
        return { writeStream, promise, fileKey: publicId, url };
    }
}
exports.CloudinaryFileService = CloudinaryFileService;
CloudinaryFileService.identifier = "cloudinary";
exports.services = [CloudinaryFileService];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jbG91ZGluYXJ5LWZpbGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQThDO0FBQzlDLG1DQUE0QztBQWlCNUMsTUFBYSxxQkFBcUI7SUFJaEMsWUFBWSxFQUFHLEVBQUUsT0FBMEI7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsZUFBVSxDQUFDLE1BQU0sQ0FBQztZQUNoQixVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7WUFDOUIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO1lBQ3hCLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtTQUMvQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUEyQjtRQUN0QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxpQkFBaUIsQ0FBQztRQUN6RCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLE1BQU0sTUFBTSxHQUFHLGVBQVUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUM5QyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLEVBQ2pDLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUNoQixJQUFJLEtBQUssSUFBSSxDQUFDLE1BQU07b0JBQUUsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzNDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUM3RCxDQUFDLENBQ0YsQ0FBQztZQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDMUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPO2dCQUNkLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFjLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBK0I7UUFDMUMsTUFBTSxlQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxRQUE0QjtRQUN4RCxPQUFPLGVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsUUFBNEI7UUFDbEQsTUFBTSxHQUFHLEdBQUcsZUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDL0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDNUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxpQkFBUSxFQUFFLENBQUM7UUFDaEMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbkMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQixPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUE0QjtRQUM1QyxNQUFNLEdBQUcsR0FBRyxlQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMvRCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxRQUFpQztRQU1yRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxpQkFBaUIsQ0FBQztRQUN6RCxJQUFJLGFBQW1ELENBQUM7UUFDeEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQ3pCLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxhQUFhLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUMxQyxDQUFDO1FBQ0YsTUFBTSxXQUFXLEdBQUcsZUFBVSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQ25ELEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsRUFDakMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDWixJQUFJLE1BQU07Z0JBQUUsYUFBYSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQy9FLENBQUMsQ0FDRixDQUFDO1FBQ0YsTUFBTSxRQUFRLEdBQUcsR0FBRyxNQUFNLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2xELE1BQU0sR0FBRyxHQUFHLGVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDdkQsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUMxRCxDQUFDOztBQTFFSCxzREEyRUM7QUExRVEsZ0NBQVUsR0FBRyxZQUFZLENBQUM7QUE0RXRCLFFBQUEsUUFBUSxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyJ9