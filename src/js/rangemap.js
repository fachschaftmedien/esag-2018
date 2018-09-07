export default function(low, high, newLow, newHigh, value){
  return (value-low)/(high-low) * (newHigh-newLow) + newLow;
}
