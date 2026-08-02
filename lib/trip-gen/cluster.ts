import type { Candidate } from "../type";

type Cluster = {
    center : { lat:number, lng:number},
    points : Candidate[]
}

//Range between 2 position
export function haversine(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371; 
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function toRad(dog:number):number{
    return (dog * Math.PI)/180;
}

export function trimByRating(
    candidate: Candidate[],
    limit:number
):Candidate[]{
    return [...candidate]
        .sort(((a,b)=> (b.rating ?? 0) - (a.rating ?? 0) ))
        .slice(0, limit)
}

//Kmean algorithm to cluster the candidate by location
export function kMeans(candidates: Candidate[], k:number, maxIterations:number = 10):Candidate[][] {
    // Implementation for k-means clustering
    if(candidates.length <= k){
      return candidates.map(c=>[c]);
    }

    //Pick k random candidates as initial centroids
    let clusters: Cluster[] = candidates.slice(0, k).map((c)=>({
      center:{ lat:c.lat, lng:c.lng },
      points:[c]
    }));

    for(let iteration = 0; iteration < maxIterations; iteration++){

      clusters.forEach(cluster => cluster.points = []);

      for(const c of candidates){
        let nearest = 0;
        let minDist = Infinity;
        for(let i = 0; i < clusters.length; i++){
          const dist = haversine({lat:c.lat, lng:c.lng}, clusters[i].center);
          if(dist < minDist){
            minDist = dist;
            nearest = i;
          }
        }
        clusters[nearest].points.push(c);
      }
    }

    //Move the center of each cluster to the mean of its points
    let moved = false;
    for (const cl of clusters) {
      if (cl.points.length === 0) continue;
      const avgLat = cl.points.reduce((s, p) => s + p.lat, 0) / cl.points.length;
      const avgLng = cl.points.reduce((s, p) => s + p.lng, 0) / cl.points.length;
      if (avgLat !== cl.center.lat || avgLng !== cl.center.lng) {
        cl.center = { lat: avgLat, lng: avgLng };
        moved = true;
      }
      if (!moved) break;
    }

    return clusters.map((cl) => cl.points);
}

// Cân bằng số điểm giữa các cụm cho gần đều nhau
export function balanceClusters(
  clusters: Candidate[][],
  targetSize: number
): Candidate[][] {
  const centers = clusters.map(centroid);

  for (let step = 0; step < 50; step++) {
    // Tìm cụm đông nhất và cụm ít nhất
    let biggest = 0;
    let smallest = 0;
    clusters.forEach((cl, i) => {
      if (cl.length > clusters[biggest].length) biggest = i;
      if (cl.length < clusters[smallest].length) smallest = i;
    });

    if (clusters[biggest].length - clusters[smallest].length <= 1) break;

    const donor = clusters[biggest];
    const targetCenter = centers[smallest];
    let bestIdx = 0;
    let bestDist = Infinity;
    donor.forEach((p, i) => {
      const d = haversine(p, targetCenter);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });

    const [moved] = donor.splice(bestIdx, 1);
    clusters[smallest].push(moved);

    // Cập nhật lại tâm 2 cụm vừa đổi
    centers[biggest] = centroid(clusters[biggest]);
    centers[smallest] = centroid(clusters[smallest]);
  }

  return clusters;
}

function centroid(points: Candidate[]): { lat: number; lng: number } {
  if (points.length === 0) return { lat: 0, lng: 0 };
  const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const lng = points.reduce((s, p) => s + p.lng, 0) / points.length;
  return { lat, lng };
}