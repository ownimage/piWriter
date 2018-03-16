import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePlaylistsComponent } from './browse-playlists.component';

describe('BrowsePlaylistsComponent', () => {
  let component: BrowsePlaylistsComponent;
  let fixture: ComponentFixture<BrowsePlaylistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowsePlaylistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsePlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
