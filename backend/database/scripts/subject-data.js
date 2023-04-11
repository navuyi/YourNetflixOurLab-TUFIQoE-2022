const sqlite3 = require("sqlite3").verbose()
let db = new sqlite3.Database("database.db")

const data = [
    [201, "M", 19],
    [202, "K", 20],
    [203, "M", 20],
    [204, "K", 21],
    [205, "M", 18],
    [206, "K", 22],
    [207, "M", 19],
    [208, "M", 18],
    [209, "K", 21],
    [210, "K", 39],
    [211, "K", 20],
    [212, "M", 22],
    [213, "K", 19],
    [214, "M", 22],
    [215, "M", 21],
    [216, "K", 20],
    [217, "K", 67],
    [218, "K", 64],
    [219, "K", 66],
    [220, "K", 65],
    [221, "M", 67],
    [222, "M", 69],
    [223, "K", 27],
    [224, "M", 61],
    [225, "K", 49],
    [226, "K", 20],
    [227, "M", 28],
    [228, "M", 24],
    [229, "K", 27],
    [230, "M", 24],
    [231, "K", 24],
    [232, "K", 23],
    [233, "K", 24],
    [234, "K", 21],
    [235, "K", 22],
    [236, "K", 24],
    [237, "K", 61],
    [238, "K", 69],
    [239, "M", 71],
    [240, "K", 63],
    [241, "M", 81],
    [242, "K", 70],
    [243, "K", 61],
    [244, "K", 80],
    [245, "M", 71]
]


const fill_subject_data = () => {
    for(const datum of data){
        db.run("UPDATE experiment SET subject_age=$age, subject_sex=$sex WHERE subject_id=$subject_id", {
            $age: datum[2],
            $sex: datum[1] === "M" ? "male" : "female",
            $subject_id: datum[0]
        })
    }
}

//fill_subject_data()