import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent {
  readonly placeholderPosts = [
    { id: 1, topic: 'Java', author: 'user1', date: '27 avr. 2026', title: 'Article test 1', excerpt: 'Un article très intéressant sur Java.' },
    { id: 2, topic: 'Angular', author: 'user2', date: '26 avr. 2026', title: 'Article test 2', excerpt: 'Un article très intéressant sur Angular.' },
    { id: 3, topic: 'Spring', author: 'user3', date: '25 avr. 2026', title: 'Article test 3', excerpt: 'Un article très intéressant sur Spring.' },
  ];
}
