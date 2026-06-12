// primitive ahh gradle dependency parser
// feel free to open issues if you encounter bugs or feature requests
// it helps a lot :)) (although i'm busy af)

type GradleDependency = {
    group: string,
    name: string,
    version: string
}

function parseDependencyLine(line: string): GradleDependency {
    return {
        group: "tung",
        name: "tung",
        version: "tung sahur"
    };
}