import * as THREE from 'three';

export const loadCurvedPathPoints = async (jsonPath: string) => {
    try {
        const response = await fetch(jsonPath);
        const data = await response.json();
        return data.points.map((point: any) => new THREE.Vector3(point.x, point.y, point.z));
    } catch (err) {
        console.error('Error loading curved path:', err);
        return [];
    }
};
