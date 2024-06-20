import { TestBed } from '@angular/core/testing';

import { ChatbotStatusService } from './chatbot-status.service';

describe('ChatbotStatusService', () => {
  let service: ChatbotStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
