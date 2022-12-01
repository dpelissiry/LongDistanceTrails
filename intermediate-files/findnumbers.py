import pandas as pd
import csv

rows = []
files = ["Arizona-National-Scenic-Trail.csv",
        "Batona Trail.csv",
        "Benton MacKaye Trail.csv",
        "Big SEKI Loop.csv",
        "Colorado Trail (Full Route).csv",
        r"C:\Users\cwbcd\Desktop\Continental Divide National Scenic Trail Through the US.csv",
        r"C:\Users\cwbcd\Desktop\John Muir Trail.csv",
        r"C:\Users\cwbcd\Desktop\Laurel Highlands Hiking Trail Mile 70 to 0.csv",
        r"C:\Users\cwbcd\Desktop\Long Path Trail.csv",
        r"C:\Users\cwbcd\Desktop\New England Trail (NET).csv",
        r"C:\Users\cwbcd\Desktop\North Country National Scenic Trail_ Wisconsin.csv",
        r"C:\Users\cwbcd\Desktop\Northville - Placid Trail.csv",
        r"C:\Users\cwbcd\Desktop\Pacific Crest Trail.csv",
        r"C:\Users\cwbcd\Desktop\Pinhoti Trail.csv",
        r"C:\Users\cwbcd\Desktop\Tahoe Rim Trail (TRT).csv",
        r"C:\Users\cwbcd\Desktop\The Appalachian Trail_ Georgia to Maine.csv",
        r"C:\Users\cwbcd\Desktop\The Long Trail.csv",
        r"C:\Users\cwbcd\Desktop\The Wonderland Trail.csv",
        r"C:\Users\cwbcd\Desktop\Tuscarora Trail.csv"

]

for x in range(0,2590,10):
    sublist = []
    sublist.append(x)
    for file in files:
        f = pd.read_csv(file)
        lots_of_values = f[round(f['Distance']) == x].values.tolist()
        if len(lots_of_values) != 0:
            one_value = lots_of_values[round((len(lots_of_values) - 1)/2)]
            elevation = one_value[2]
            distance = round(one_value[3])
            #sublist.append(distance)
            sublist.append(elevation)
        else:
            sublist.append('-')
    rows.append(sublist)

print(rows)


with open('out.csv', 'w', newline='', encoding='utf-8') as fd:

    # using csv.writer method from CSV package
    write = csv.writer(fd)
    cols = ['distance',
'Arizona National Scenic Trail',
'Batona Trail',
'Benton MacKaye Trail',
'Big SEKI Loop',
'Colorado Trail',
'Continental Divide National Scenic Trail Through the US',
'John Muir Trail',
'Laurel Highlands Hiking Trail (Mile 70 - 0)',
'Long Path Trail',
'New England Trail',
'North Country National Scenic Trail',
'Northville',
'Pacific Crest Trail',
'Pinhoti Trail',
'Tahoe Rim Trail',
'The Appalachian Trail (Georgia to Maine)',
'The Long Trail',
'The Wonderland Trail',
'Tuscarora Trail'

    
    ]

    write.writerow(cols)
    write.writerows(rows)
