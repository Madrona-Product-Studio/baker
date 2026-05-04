export interface Trail {
  id: string;
  name: string;
  distance: string;
  elevation: string;
  waypoints: string[];
}

export const TRAILS: Trail[] = [
  {
    id: 'artist-point',
    name: 'Artist Point Loop',
    distance: '1.5 miles',
    elevation: '200 ft gain',
    waypoints: ['Parking Area', 'Table Mountain Junction', 'Artist Point Summit', 'Huntoon Point'],
  },
  {
    id: 'chain-lakes',
    name: 'Chain Lakes Loop',
    distance: '6.5 miles',
    elevation: '1,600 ft gain',
    waypoints: ['Artist Point TH', 'Bagley Lakes Junction', 'Herman Saddle', 'Hayes Lake', 'Mazama Lake', 'Iceberg Lake', 'Table Mountain Base'],
  },
  {
    id: 'ptarmigan-ridge',
    name: 'Ptarmigan Ridge',
    distance: '10.5 miles RT',
    elevation: '2,200 ft gain',
    waypoints: ['Artist Point TH', 'Chain Lakes Junction', 'Open Slopes', 'Camp Kiser', 'Coleman Pinnacle'],
  },
  {
    id: 'railroad-grade',
    name: 'Railroad Grade',
    distance: '8 miles RT',
    elevation: '3,900 ft gain',
    waypoints: ['Heliotrope Ridge TH', 'Hogsback', 'Moraine Edge', 'Upper Railroad Grade'],
  },
  {
    id: 'park-butte',
    name: 'Park Butte Lookout',
    distance: '7.5 miles RT',
    elevation: '2,200 ft gain',
    waypoints: ['Schreibers Meadow TH', 'Morovitz Meadow', 'Mazama Park', 'Park Butte Lookout'],
  },
  {
    id: 'scott-paul',
    name: 'Scott Paul Trail',
    distance: '10 miles RT',
    elevation: '1,700 ft gain',
    waypoints: ['Schreibers Meadow TH', 'Forest Section', 'Moraine Viewpoint', 'Upper Meadows'],
  },
];
