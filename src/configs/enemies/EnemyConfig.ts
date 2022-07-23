export interface CircleDisplay {
  color: number;
  radius: number;
}

// points of the path the enemy follows
// controlled only by time, so doesn't have
// "make 3 shots, then fly away" mechanic
// time is relative - "length of this step"
export interface PathPoint {
  x: number;
  y: number;
  delay: number;
}
