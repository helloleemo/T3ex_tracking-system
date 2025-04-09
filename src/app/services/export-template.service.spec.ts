import { TestBed } from '@angular/core/testing';

import { ExportTemplateService } from './export-template.service';

describe('ExportTemplateService', () => {
  let service: ExportTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
