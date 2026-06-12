import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'gr-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss',
})
export class TerminalComponent implements AfterViewChecked {
  @ViewChild('terminalBody') private terminalBody!: ElementRef;

  public currentInput: string = '';
  public commandHistory: { prompt: string; output: string | any; isJson: boolean }[] = [];

  public devProfile = {
    name: 'Guilherme Rondon',
    age: 24,
    role: 'Software Engineer & Student',
    routine: 'Code, Gym, Deploy, Repeat',
  };

  public devStack = {
    backend: ['C#', 'Java', 'PHP', 'Go'],
    frontend: ['Angular', 'JavaScript', 'HTML/CSS'],
    database: ['PostgreSQL', 'SQL Server'],
    infra_devops: ['Docker', 'Kubernetes', 'Linux (Debian)'],
  };

  constructor() {
    this.commandHistory.push({
      prompt: '',
      output: 'Welcome to Guilherme Rondon CLI. Type "help" to see available commands.',
      isJson: false
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.terminalBody.nativeElement.scrollTop = this.terminalBody.nativeElement.scrollHeight;
    } catch(err) { }
  }

  public executeCommand(): void {
    const cmd = this.currentInput.trim().toLowerCase();
    
    if (!cmd) {
      this.commandHistory.push({ prompt: 'visitor@guilhermerondon:~$ ', output: '', isJson: false });
      this.currentInput = '';
      return;
    }

    let output: any = '';
    let isJson = false;

    switch (cmd) {
      case 'help':
        output = 'Available commands: help, skills, whoami, contact, clear';
        break;
      case 'skills':
        output = this.devStack;
        isJson = true;
        break;
      case 'whoami':
        output = 'Hi! I am Guilherme Rondon, a 24yo Software Engineer & Student.\nMy routine: Code, Gym, Deploy, Repeat.';
        break;
      case 'contact':
        output = 'LinkedIn: https://linkedin.com/in/guilherme-rondon-5476a5195\nGitHub: https://github.com/guilhermerondon';
        break;
      case 'clear':
        this.commandHistory = [];
        this.currentInput = '';
        return;
      default:
        output = `Command not found: ${cmd}. Type 'help' for available commands.`;
        break;
    }

    this.commandHistory.push({ prompt: `visitor@guilhermerondon:~$ ${this.currentInput}`, output: output, isJson: isJson });
    this.currentInput = '';
  }
}
