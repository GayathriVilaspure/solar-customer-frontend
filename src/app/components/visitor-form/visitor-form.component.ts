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
  visitorId!: number;
  loading = false;
  isEditMode = false; 
  constructor(
    private fb: FormBuilder,
    private visitorService: VisitorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadVisitorIfPresent();
  }

  private initForm(): void {
    this.visitorForm = this.fb.group({
      consumerName: ['', Validators.required],
      consumerNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      consumerEmail: ['', [Validators.required, Validators.email]],
      installationStatus: ['', Validators.required]
    });
  }

  private loadVisitorIfPresent(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.visitorId = +id;

        this.visitorService.getVisitorById(this.visitorId).subscribe({
          next: (visitor: Visitor) => {
            this.visitorForm.patchValue(visitor);
          },
          error: (error: any) => {
            console.error('Error loading visitor:', error);
            alert('Failed to load visitor data');
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.visitorForm.invalid) {
      this.visitorForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const visitor: Visitor = {
      ...this.visitorForm.value
      // ID not included on purpose to force creation
    };

    this.visitorService.createVisitor(visitor).subscribe({
      next: () => {
        alert('Visitor installation info submitted successfully!');
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error('Error submitting visitor info:', error);
        alert('Failed to submit visitor data. Please try again.');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
