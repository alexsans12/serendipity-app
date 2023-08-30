import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HttpCacheService {
	private httpResponseCache: { [key: string]: HttpResponse<any> } = {};

	put = (key: string, httpResponse: HttpResponse<any>): void => {
		console.log('caching response', key, httpResponse);
		this.httpResponseCache[key] = httpResponse;
	}

	get = (key: string): HttpResponse<any> | null | undefined => this.httpResponseCache[key];

	evict = (key: string): boolean => delete this.httpResponseCache[key];

	evictAll = (): void => {
		console.log('evicting all cached responses');
		this.httpResponseCache = {};
	};

	logCache = (): void => console.log('cache', this.httpResponseCache);
}
