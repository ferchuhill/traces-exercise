import Statistics from '../../models/statistics';
import createError from 'http-errors';

const statisticsHandler = async () => {

  let longestDistance; 
  try {
    // Find in Statistics the longest distance to USA
    const statisticsLongestDistance = await Statistics.aggregate([
      {
        $sort: { distance_to_usa: -1 },
      },
      {
        $limit: 1,
      },
    ]);
    
    longestDistance = 
            statisticsLongestDistance.length > 0  
              ? {
                country: statisticsLongestDistance[0].name,
                value: statisticsLongestDistance[0].distance_to_usa,
              }
              : {
                country: '',
                value: 0,
              };
  } catch (err) {
    return createError(500, 'Error getting the distance to USA');
  }

  // Find in Statistics the count of the most trace by country name
  let mostTraced;
  try {
    const resultMostTrace = await Statistics.aggregate([
      {
        $group: {
          _id: '$name',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    mostTraced =
            resultMostTrace.length > 0
              ? {
                country: resultMostTrace[0]._id,
                value: resultMostTrace[0].count,
              }
              : {
                country: '',
                value: 0,
              };
            
  } catch (err) {
    throw createError(500, 'Error getting the most traced country');
  }

  return {
    longest_distance: longestDistance,
    most_traced: mostTraced,
  };
};

export { statisticsHandler };
