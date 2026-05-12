import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InfraService } from './infra.service';
import { environment } from '../../environments/environment';

describe('InfraService', () => {
  let service: InfraService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InfraService]
    });
    service = TestBed.inject(InfraService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar a lista de monitores', () => {
    const mockMonitors = [
      { id: 1, name: 'API 1', url: 'http://api1', interval: 15, current_status: 'Online' }
    ];

    service.getMonitors().subscribe(monitors => {
      expect(monitors.length).toBe(1);
      expect(monitors[0].name).toBe('API 1');
    });

    const req = httpMock.expectOne(`${environment.watchdogApiUrl}/api/monitors`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMonitors);
  });
});
