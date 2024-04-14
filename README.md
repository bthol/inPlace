# sysmod
Developer: Blake Thollaug

Description: Sysmod is tool for designing inventory systems that employs the simulation of storing, organizing, and retrieving in parametric inventory models. Visuals are corporate academic style.

Each spatial model is an organized list of objects, where each object represents a point in the space modelled.

Their method of generation is three levels of nested iteration (cubic complexity; O(n^3)).
    
Because a nested iterator must complete all of its iterations before changing the iteration for the superiterator, higher levels of iterator nesting cause higher frequencies of iterator operation. When all the iterators are adding to the same list in their order of operation, their frequency of operation is represented in their frequency in the list.

In model generation, level of iterator nesting ordered from least to most is x, y, z.
    
To calculate the rate of change for a coordinate, one must divide the number of objects in the list by the number of changes to that coordinate in the list.

Becuase z has the highest level of nesting and thus the highest rate of change, z values change for every object in the list A.K.A. the number of objects in the list. Therefore, the rate of change for z in the list is the number of objects in the list / the number of objects in the list or just 1.

The y coordinate, iterated as the superiterator of z, only changes after every iteration of z has been completed. Therefore, the rate of change for y in the list is z.
    
The number of objects in the spatial model is equal to the number of points in the space modelled (maximum structural efficiency). The number of points in 3D space can be calculated by x * y * z. Therefore, the rate of change for x in the list is the number of objects in the list / x  A.K.A.  x * y * z / x = y * z.

The rates of change for a coordinate can be multiplied by their respective coordinates values to determine the minimum ammount into the list that the coordinate triple with that coordinate value must be. The minimums for each coordinate value can be summed to produce the index in the list at which there exists that coordinate triple.

id est:
x coordinate value * rate of change of x in list + y coordinate value * rate of change of y in list + z coordinate value * rate of change of z in list

rate of change for z in list = 1
rate of change for y in list = z
rate of change for x in list = y * z

Therefore, the index in the list for the coordinate triple with given coordinate values = ( x coordinate * y * z ) + ( y coordinate * z ) + ( z coordinate ) = ( x minimum index ) + ( y minimum index ) + ( z minumum index )

NOTE: This solution only works for positive/non-integer spatial models, because the coordinate value in desired coordinate triple are not equal to their index positions in the list.
NOTE: This solution works at constant complexity ( O(n) ) making it the choice solution for object rendering in positive space for its maximal efficiency.

For integer spatial models, a different solution is needed.