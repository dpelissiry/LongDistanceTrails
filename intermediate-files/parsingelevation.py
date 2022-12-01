import geojson, math, os

R = 6371e3


def distance_calc(coord, prev_coord):
    theta1 = float(coord[0]) * math.pi / 180
    theta2 = float(prev_coord[0]) * math.pi / 180
    deltatheta = (float(prev_coord[0]) - float(coord[0])) \
                 * math.pi / 180
    deltalambda = (float(prev_coord[1]) - float(coord[1])) \
                  * math.pi / 180

    a = math.sin(deltatheta / 2) * math.sin(deltatheta / 2) + math.cos(theta1) * \
        math.cos(theta2) * math.sin(
        deltalambda / 2) * math.sin(deltalambda / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    #d =(R*c)
    d = ((R * c) * 3.28084)/5280
    return d

# data frame for long lat conversion

def distance(trail_filesrc, file):
    total_distance = 0
    elevation_gain = 0

    with open(trail_filesrc,encoding="utf8") as read:
        content = read.readlines()
        prev_coord = list(map(float,content[1].split(",")[0:2]))
        prev_elev = float((content[1].split(",")[2:3])[0])
        with open("elevation_data2\\"+file,"w") as write_file:
            write_file.write(content[0].strip("\n")+",Distance,Elevation Gain\n")
            for line in content[1 :len(content)-1]:
                elev = float((line.split(",")[2:3])[0])
                coord = list(map(float,line.split(",")[0:2]))
                # if (elev > prev_elev):
                elevation_gain+=(abs(elev-prev_elev))
                total_distance += distance_calc(coord, prev_coord)

                write_file.write(line.strip("\n")+"," + str(total_distance)+","+str(elevation_gain)+"\n")
                prev_coord, prev_elev = coord, elev




    # for i in range(len(trail['features'])):
    #     if trail['features'][i]['id'] != northpoint:
    #         continue
    #     if (len(trail['features'][i]["geometry"]["coordinates"][0]) != 2): # flattens list if it is list of list of lists
    #         trail['features'][i]["geometry"]["coordinates"] = flatten(trail['features'][i]["geometry"]["coordinates"])
    #
    #     prev_coord = trail['features'][i]["geometry"]["coordinates"][0]  # prev coord is the first coord
    #
    #     for coord in trail['features'][i]["geometry"]["coordinates"]:
    #         if (coord == prev_coord):
    #             continue
    #
    #         d = distance_calc(coord, prev_coord)
    #         if (d> 1000):
    #             print(d)
    #         total_distance += d
    #         write_file.write(str(coord[1]) + ", " + str(coord[0]) + ", " + str(total_distance/5280) + "\n")
    #         prev_coord = coord
    # write_file.seek(0)
    # write_file.write("\n")
    # write_file.write(str(total_distance/5280) +" miles\n")
    # write_file.close()

for file in os.listdir('elevation_data'):
    f = os.path.join('elevation_data', file)
    distance(f, file)

# print(distance_calc([37.724851, -119.533015],[36.57859, -118.292138]))
