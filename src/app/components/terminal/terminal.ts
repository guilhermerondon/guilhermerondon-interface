import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gr-terminal',
  imports: [CommonModule],
  templateUrl: './terminal.html',
  styleUrl: './terminal.scss',
})
export class Terminal implements OnInit {
  public devProfile = {
    name: 'Guilherme Rondon',
    age: 24,
    role: 'Software Engineer & Student',
    stack: {
      backend: ['C#', 'Java', 'PHP', 'Go'],
      frontend: ['Angular', 'JavaScript', 'HTML/CSS'],
      database: ['PostgreSQL', 'SQL Server'],
      infra_devops: ['Docker', 'Kubernetes', 'Linux (Debian)'],
    },
    routine: 'Code, Gym, Deploy, Repeat',
  };

  public fullCommand: string = 'guilhermerondon.getProfile()';
  public typedCommand: string = '';
  public showJson: boolean = false;
  public isTyping: boolean = true;

  ngOnInit(): void {
    this.typeEffect();
  }

  private typeEffect(): void {
    let currentIndex = 0;
    const interval = setInterval(() => {
      this.typedCommand += this.fullCommand.charAt(currentIndex);
      currentIndex++;

      if (currentIndex >= this.fullCommand.length) {
        clearInterval(interval);
        this.isTyping = false; // Parar o cursor do comando

        // Delay para simular a resposta do servidor
        setTimeout(() => {
          this.showJson = true;
        }, 500);
      }
    }, 50); // 50ms delay per char
  }
}
