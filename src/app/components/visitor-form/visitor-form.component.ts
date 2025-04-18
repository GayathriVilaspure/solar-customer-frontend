import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Visitor } from '../../model/visitor';
import { VisitorService } from 'src/app/services/visitor.service';

@Component({
  selector: 'app-visitor-form',
  templateUrl: './visitor-form.component.html',
  styleUrls: ['./visitor-form.component.css']
})
export class VisitorFormComponent implements OnInit {
  visitorForm!: FormGroup;
  isEditMode = false;
  visitorId!: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private visitorService: VisitorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.visitorForm = this.fb.group({
      consumerName: ['', Validators.required],
      consumerNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      consumerEmail: ['', [Validators.required, Validators.email]],
      installationStatus: ['', Validators.required]
    });
  }

  private checkEditMode(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.visitorId = +id;
        this.loadVisitor(this.visitorId);
      }
    });
  }

  private loadVisitor(id: number): void {
    this.loading = true;
    this.visitorService.getVisitorById(id).subscribe({
      next: (visitor: Visitor) => {
        this.visitorForm.patchValue(visitor);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading visitor:', error);
        this.loading = false;
        alert('Failed to load visitor data');
      }
    });
  }

  onSubmit(): void {
    if (this.visitorForm.invalid) {
      this.visitorForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.visitorForm.value;

    // Ensure we have a valid ID in edit mode
    if (this.isEditMode && (isNaN(this.visitorId) || this.visitorId <= 0)) {
      alert('Invalid customer ID');
      this.loading = false;
      return;
    }

    const visitor: Visitor = {
      ...formData,
      ...(this.isEditMode && { id: this.visitorId })
    };

    const operation = this.isEditMode 
      ? this.visitorService.updateVisitor(visitor)
      : this.visitorService.createVisitor(visitor);

    operation.subscribe({
      next: () => {
        alert(`Visitor ${this.isEditMode ? 'updated' : 'added'} successfully!`);
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error(`Error ${this.isEditMode ? 'updating' : 'adding'} visitor:`, error);
        alert(`Failed to ${this.isEditMode ? 'update' : 'add'} visitor. Please try again.`);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}