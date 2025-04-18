import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VisitorService } from 'src/app/services/visitor.service';
import { Visitor } from '../../model/visitor';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  visitors: Visitor[] = [];
  filteredVisitors: Visitor[] = [];
  searchTerm: string = '';
  loading: boolean = false;

  constructor(
    private visitorService: VisitorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVisitors();
  }

  loadVisitors(): void {
    this.loading = true;
    this.visitorService.getVisitors().subscribe({
      next: (data) => {
        this.visitors = data;
        this.filteredVisitors = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading visitors:', error);
        this.loading = false;
        alert('Error loading visitors. Please try again.');
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredVisitors = [...this.visitors];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredVisitors = this.visitors.filter(visitor => 
      visitor.consumerName.toLowerCase().includes(term) ||
      visitor.consumerNumber.toString().includes(term) ||
      visitor.consumerEmail?.toLowerCase().includes(term)
    );
  }

  addVisitor(): void {
    this.router.navigate(['/visitor/add']);
  }

  viewVisitor(id: number): void {
    this.router.navigate(['/visitor', id]);
  }

  editVisitor(id: number): void {
    this.router.navigate(['/visitor', id, 'edit']);
  }

  deleteVisitor(id: number): void {
    if (confirm('Are you sure you want to delete this visitor?')) {
      this.visitorService.deleteVisitor(id).subscribe({
        next: () => {
          this.loadVisitors();
          alert('Visitor deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting visitor:', error);
          alert('Error deleting visitor. Please try again.');
        }
      });
    }
  }

  trackById(index: number, visitor: Visitor): number {
    return visitor.id ?? -1;
  }
}