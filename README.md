## Project goal

- Load Car options avalaible
- Allow the selection of an specific car
- Allow the Visualization of the colected data of the Car
- Display it usin webGL
- Mantain API access centralized and decouple of the client

API: https://vehicle-api-test.herokuapp.com

## Problems

## First Plan 
> create the data fetcher handler
> provide the fetching of data by user input
> create an canvas with:
> - A model of a car
> - Stacked boxes representing the data value

## Run the Project
> node: ^16

```bash 
    git clone https://github.com/Visko93/dashboard-ox.git
```
```bash 
    cd dashboard-ox
```
```bash 
    npm install
```
```bash 
    npm run dev
```

## Improve
    1 - Tests, right now the project has no tests, I would build at least a couple Integration tests.
    2 - Types, there are a couple components with unsuficient types, would be a good Idea to fix that
    3 - Design, I would probably do an better selector or even a modal on the cars row and create a more structured dashboard (More data, background, would use some D3.js for the charts)
    4 - Add some animations to the dashboard specialy onload and on the model
    5 - Add some request manager like axios