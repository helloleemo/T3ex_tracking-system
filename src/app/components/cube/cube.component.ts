import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-cube',
  standalone: true,
  template: `<div #cubeContainer class="w-full h-[400px] bg-white">
    
  </div>`,
  styles: [`
  
    :host { display: block; width: 100%; height: 400px; }
  `]
})
export class CubeComponent implements AfterViewInit {
  @ViewChild('cubeContainer', { static: true }) cubeContainer!: ElementRef;
  @Input() length: number = 1;
  @Input() width: number = 1;
  @Input() height: number = 1;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cubeEdges!: THREE.LineSegments;
  private controls!: OrbitControls;

  ngAfterViewInit() {
    this.initThreeJS();
  }

  private initThreeJS() {
    const container = this.cubeContainer.nativeElement;

    // 建立場景
    this.scene = new THREE.Scene();

    // 設定相機
    this.camera = new THREE.PerspectiveCamera(40, container.clientWidth / 400, 0.1, 1000);
    this.camera.position.set(100, 100, 100); // 設定相機初始位置
    this.camera.lookAt(0, 0, 0);

    // 設定渲染器 (背景白色)
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, 400);
    this.renderer.setClearColor(0xffffff);
    container.appendChild(this.renderer.domElement);

    // 創建立方體的邊線
    const geometry = new THREE.BoxGeometry(this.length, this.height, this.width);
    const edges = new THREE.EdgesGeometry(geometry); // 產生立方體邊界
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }); // 黑色邊線
    this.cubeEdges = new THREE.LineSegments(edges, lineMaterial);
    this.scene.add(this.cubeEdges);

    // 滑鼠控制器（OrbitControls）
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.5;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;

    // 初始渲染
    this.animate();
  }

  // 動畫函數（讓控制器流暢運作）
  private animate = () => {
    requestAnimationFrame(() => this.animate()); // 確保 `this` 正確綁定
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
