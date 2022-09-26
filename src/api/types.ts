type Vehicle = {
    id: string;
    name: string;
    color: string;
    plate_number: string
}

type TelemetryMessage = {
    vehicle_id: string;
    timestamp: number;
    lat: number;
    lng: number;
    cpu_usage: number;
    battery_level: number;
}

export type {
    TelemetryMessage,
    Vehicle
}