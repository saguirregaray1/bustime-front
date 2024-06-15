import busLogo from "./assets/bus.svg";
import MarkerWithInfoWindow from "./MarkerWithInfoWindow";

type Props = {
  points: { id: number; lat: number; lng: number }[];
};

const Points = ({ points }: Props) => {
  return (
    <>
      {points.map((point) => (
        <MarkerWithInfoWindow
          position={{ lat: point.lat, lng: point.lng }}
          key={point.id}
          id={point.id.toString()}
        >
          <img src={busLogo} alt="React Logo" style={{ width: 40 }} />
        </MarkerWithInfoWindow>
      ))}
    </>
  );
};

export default Points;
