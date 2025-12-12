const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

export interface Flight {
  id: string;
  airline: string;
  logo: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  seats: number;
  rating: number;
  amenities: string[];
  departureAirport: string;
  arrivalAirport: string;
  aircraftType: string;
  cabinClass: string;
  baggage: {
    checked: string;
    cabin: string;
  };
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  airportCode: string;
  airportFull: string;
  image: string;
  description: string;
  priceFrom: number;
  currency: string;
  popularRoutes: string[];
  flights: number;
  flightOptions: number;
  airlines: string[];
}

// Interfaces for airport data
export interface Airport {
  name: string;
  code: string;
  full: string;
}

export interface DestinationCity extends Airport {
  country?: string;
}

export interface AirportData {
  uaeAirports: Airport[];
  destinationCities: {
    [country: string]: DestinationCity[];
  };
  bannerImage?: string; // banner image
}

// GraphQL Query to fetch collection by handle
const COLLECTION_QUERY = `
  query GetCollection($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: 20) {
        edges {
          node {
            id
            title
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            tags
            metafields(identifiers: [
              {namespace: "flight", key: "number"},
              {namespace: "flight", key: "departure_time"},
              {namespace: "flight", key: "arrival_time"},
              {namespace: "flight", key: "duration"},
              {namespace: "flight", key: "stops"},
              {namespace: "flight", key: "seats"},
              {namespace: "flight", key: "rating"},
              {namespace: "flight", key: "departure_airport"},
              {namespace: "flight", key: "arrival_airport"},
              {namespace: "flight", key: "aircraft_type"},
              {namespace: "flight", key: "cabin_class"},
              {namespace: "flight", key: "checked_baggage"},
              {namespace: "flight", key: "cabin_baggage"},
              {namespace: "flight", key: "amenities"},
              {namespace: "destination", key: "city"},
              {namespace: "destination", key: "country"},
              {namespace: "destination", key: "airport_code"},
              {namespace: "destination", key: "description"},
              {namespace: "destination", key: "image_url"},
              {namespace: "destination", key: "popular_routes"},
              {namespace: "destination", key: "weekly_flights"}
            ]) {
              key
              value
            }
          }
        }
      }
    }
  }
`;

// GraphQL Query to fetch collection metafields (for airport data)
const COLLECTION_METAFIELDS_QUERY = `
  query GetCollectionMetafields($handle: String!) {
    collection(handle: $handle) {
      id
      title
      image {
        url
        altText
      }
      metafields(identifiers: [
        {namespace: "custom", key: "uae_airports"},
        {namespace: "custom", key: "destination_cities"}
      ]) {
        key
        value
      }
    }
  }
`;

// Fetch airport data from Shopify collection metafields
export const fetchAirportData = async (): Promise<AirportData> => {
  try {
    const response = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: COLLECTION_METAFIELDS_QUERY,
        variables: { handle: 'popular' },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify API errors:', data.errors);
      throw new Error('Failed to fetch airport data');
    }

    if (!data.data?.collection) {
      console.warn('Flight destinations collection not found');
      return {
        uaeAirports: [],
        destinationCities: {},
        bannerImage: undefined
      };
    }

    const collection = data.data.collection;
    const metafields = collection.metafields || [];

    // Get banner image from collection
    const bannerImage = collection.image?.url || undefined;

    const uaeAirportsMetafield = metafields.find((m: any) => m?.key === 'uae_airports');
    const destinationCitiesMetafield = metafields.find((m: any) => m?.key === 'destination_cities');

    let uaeAirports: Airport[] = [];
    let destinationCities: { [country: string]: DestinationCity[] } = {};

    // Parse UAE airports
    if (uaeAirportsMetafield?.value) {
      try {
        uaeAirports = JSON.parse(uaeAirportsMetafield.value);
      } catch (error) {
        console.error('Error parsing UAE airports:', error);
      }
    }

    // Parse destination cities
    if (destinationCitiesMetafield?.value) {
      try {
        destinationCities = JSON.parse(destinationCitiesMetafield.value);
      } catch (error) {
        console.error('Error parsing destination cities:', error);
      }
    }

    return {
      uaeAirports,
      destinationCities,
      bannerImage
    };
  } catch (error) {
    console.error('Error fetching airport data:', error);
    // Return empty data as fallback
    return {
      uaeAirports: [],
      destinationCities: {},
      bannerImage: undefined
    };
  }
};

// Fetch popular destinations from collection
export const fetchPopularDestinations = async (): Promise<Destination[]> => {
  try {
    const response = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: COLLECTION_QUERY,
        variables: { handle: 'popular' },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify API errors:', data.errors);
      throw new Error('Failed to fetch popular destinations');
    }

    if (!data.data.collection) {
      console.warn('Popular collection not found');
      return [];
    }

    const products = data.data.collection.products.edges;

    // Group flights by destination
    const destinationsMap = new Map<string, {
      destination: Destination;
      products: any[];
      airlines: Set<string>;
      lowestPrice: number;
    }>();

    products.forEach((edge: any) => {
      const product = edge.node;
      const metafields = product.metafields.reduce((acc: any, field: any) => {
        if (field) acc[field.key] = field.value;
        return acc;
      }, {});

      // Extract destination info
      const arrivalAirport = metafields.arrival_airport || '';
      const airportCode = arrivalAirport.match(/\(([^)]+)\)/)?.[1] || '';

      // Extract city and country from tags or airport name
      const cityMatch = arrivalAirport.match(/^([^(]+)/);
      const city = cityMatch ? cityMatch[1].trim().split(' ')[0] : '';
      const country = extractCountryFromTags(product.tags);

      // Create unique key for destination (by airport code)
      const destinationKey = airportCode;

      const price = parseFloat(product.priceRange.minVariantPrice.amount);
      const currency = product.priceRange.minVariantPrice.currencyCode;

      if (!destinationsMap.has(destinationKey)) {
        // Parse popular routes
        let popularRoutes: string[] = [];
        try {
          const routes = JSON.parse(metafields.popular_routes || '[]');
          popularRoutes = routes;
        } catch {
          // Extract from departure airport
          const depAirport = metafields.departure_airport || '';
          const depCode = depAirport.match(/\(([^)]+)\)/)?.[1];
          popularRoutes = depCode ? [depCode] : ['DXB'];
        }

        // Create new destination entry
        destinationsMap.set(destinationKey, {
          destination: {
            id: destinationKey,
            city: city,
            country: country,
            airportCode: airportCode,
            airportFull: arrivalAirport,
            image: metafields.image_url || product.images.edges[0]?.node.url ||
              `https://source.unsplash.com/800x600/?${encodeURIComponent(city)},city`,
            description: `${city}, ${country}`,
            priceFrom: price,
            currency: currency,
            popularRoutes: popularRoutes,
            flights: parseInt(metafields.weekly_flights || '0'),
            flightOptions: 1,
            airlines: [product.vendor]
          },
          products: [product],
          airlines: new Set([product.vendor]),
          lowestPrice: price
        });
      } else {
        // Update existing destination
        const existing = destinationsMap.get(destinationKey)!;
        existing.products.push(product);
        existing.airlines.add(product.vendor);
        existing.destination.flightOptions = existing.products.length;
        existing.destination.airlines = Array.from(existing.airlines);

        // Update lowest price if this flight is cheaper
        if (price < existing.lowestPrice) {
          existing.lowestPrice = price;
          existing.destination.priceFrom = price;
        }
      }
    });

    // Convert map to array and sort by number of flight options (descending)
    return Array.from(destinationsMap.values())
      .map(item => item.destination)
      .sort((a, b) => b.flightOptions - a.flightOptions);

  } catch (error) {
    console.error('Error fetching popular destinations:', error);
    throw error;
  }
};

// Helper function to extract country from tags
const extractCountryFromTags = (tags: string[]): string => {
  const countryTags = tags.filter(tag =>
    ['India', 'Pakistan', 'Philippines', 'Sri Lanka'].includes(tag)
  );
  return countryTags[0] || 'International';
};

// GraphQL Query to fetch flights
const FLIGHTS_QUERY = `
  query GetFlights($query: String!) {
    products(first: 50, query: $query) {
      edges {
        node {
          id
          title
          vendor
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          tags
          metafields(identifiers: [
            {namespace: "flight", key: "number"},
            {namespace: "flight", key: "departure_time"},
            {namespace: "flight", key: "arrival_time"},
            {namespace: "flight", key: "duration"},
            {namespace: "flight", key: "stops"},
            {namespace: "flight", key: "seats"},
            {namespace: "flight", key: "rating"},
            {namespace: "flight", key: "departure_airport"},
            {namespace: "flight", key: "arrival_airport"},
            {namespace: "flight", key: "aircraft_type"},
            {namespace: "flight", key: "cabin_class"},
            {namespace: "flight", key: "checked_baggage"},
            {namespace: "flight", key: "cabin_baggage"},
            {namespace: "flight", key: "amenities"}
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;

// Fetch flights from Shopify
export const fetchFlights = async (from: string, to: string): Promise<Flight[]> => {
  try {
    // Build search query based on tags
    const fromCode = from.match(/\(([^)]+)\)/)?.[1] || from;
    const toCode = to.match(/\(([^)]+)\)/)?.[1] || to;

    const query = `tag:from-${fromCode} AND tag:to-${toCode} AND product_type:Flight`;

    const response = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: FLIGHTS_QUERY,
        variables: { query },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify API errors:', data.errors);
      throw new Error('Failed to fetch flights');
    }

    const products = data.data.products.edges;

    return products.map((edge: any) => {
      const product = edge.node;
      const metafields = product.metafields.reduce((acc: any, field: any) => {
        if (field) acc[field.key] = field.value;
        return acc;
      }, {});

      // Parse amenities (it's stored as JSON string)
      let amenities: string[] = [];
      try {
        amenities = JSON.parse(metafields.amenities || '[]');
      } catch {
        amenities = [];
      }

      return {
        id: product.id.split('/').pop() || '',
        airline: product.vendor,
        logo: product.images.edges[0]?.node.url || '',
        flightNumber: metafields.number || '',
        departureTime: metafields.departure_time || '',
        arrivalTime: metafields.arrival_time || '',
        duration: metafields.duration || '',
        stops: parseInt(metafields.stops || '0'),
        price: parseFloat(product.priceRange.minVariantPrice.amount),
        currency: product.priceRange.minVariantPrice.currencyCode,
        seats: parseInt(metafields.seats || '0'),
        rating: parseFloat(metafields.rating || '0'),
        amenities,
        departureAirport: metafields.departure_airport || '',
        arrivalAirport: metafields.arrival_airport || '',
        aircraftType: metafields.aircraft_type || '',
        cabinClass: metafields.cabin_class || '',
        baggage: {
          checked: metafields.checked_baggage || '',
          cabin: metafields.cabin_baggage || '',
        },
      };
    });
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error;
  }
};

// Fetch single flight by ID
const FLIGHT_BY_ID_QUERY = `
  query GetFlightById($id: ID!) {
    product(id: $id) {
      id
      title
      vendor
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 1) {
        edges {
          node {
            url
          }
        }
      }
      metafields(identifiers: [
        {namespace: "flight", key: "number"},
        {namespace: "flight", key: "departure_time"},
        {namespace: "flight", key: "arrival_time"},
        {namespace: "flight", key: "duration"},
        {namespace: "flight", key: "stops"},
        {namespace: "flight", key: "seats"},
        {namespace: "flight", key: "rating"},
        {namespace: "flight", key: "departure_airport"},
        {namespace: "flight", key: "arrival_airport"},
        {namespace: "flight", key: "aircraft_type"},
        {namespace: "flight", key: "cabin_class"},
        {namespace: "flight", key: "checked_baggage"},
        {namespace: "flight", key: "cabin_baggage"},
        {namespace: "flight", key: "amenities"}
      ]) {
        key
        value
      }
    }
  }
`;

export const fetchFlightById = async (id: string): Promise<Flight> => {
  try {
    const gid = `gid://shopify/Product/${id}`;

    const response = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: FLIGHT_BY_ID_QUERY,
        variables: { id: gid },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify API errors:', data.errors);
      throw new Error('Failed to fetch flight');
    }

    const product = data.data.product;
    const metafields = product.metafields.reduce((acc: any, field: any) => {
      if (field) acc[field.key] = field.value;
      return acc;
    }, {});

    let amenities: string[] = [];
    try {
      amenities = JSON.parse(metafields.amenities || '[]');
    } catch {
      amenities = [];
    }

    return {
      id: product.id.split('/').pop() || '',
      airline: product.vendor,
      logo: product.images.edges[0]?.node.url || '',
      flightNumber: metafields.number || '',
      departureTime: metafields.departure_time || '',
      arrivalTime: metafields.arrival_time || '',
      duration: metafields.duration || '',
      stops: parseInt(metafields.stops || '0'),
      price: parseFloat(product.priceRange.minVariantPrice.amount),
      currency: product.priceRange.minVariantPrice.currencyCode,
      seats: parseInt(metafields.seats || '0'),
      rating: parseFloat(metafields.rating || '0'),
      amenities,
      departureAirport: metafields.departure_airport || '',
      arrivalAirport: metafields.arrival_airport || '',
      aircraftType: metafields.aircraft_type || '',
      cabinClass: metafields.cabin_class || '',
      baggage: {
        checked: metafields.checked_baggage || '',
        cabin: metafields.cabin_baggage || '',
      },
    };
  } catch (error) {
    console.error('Error fetching flight:', error);
    throw error;
  }
};