import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudName = 'Tech-2024'; // Replace with your Cloudinary cloud name
  private uploadPreset = 'product-img'; // Replace with your Cloudinary upload preset
  private apiKey = '399776691474541'; // Replace with your Cloudinary API key

  constructor(private http: HttpClient) {}

  uploadFile(file: File, publicId?: string): Observable<any> {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    if (publicId) {
      formData.append('public_id', publicId);
    }
    formData.append('api_key', this.apiKey);
    return this.http.post(url, formData);
  }
 
}
