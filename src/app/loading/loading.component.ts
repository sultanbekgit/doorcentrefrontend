import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading',
  standalone: false,
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {
  isLoading = false;
  private subscription?: Subscription;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.subscription = this.loadingService.isLoading$.subscribe(
      (loading) => this.isLoading = loading
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
} 