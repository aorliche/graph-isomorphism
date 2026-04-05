package main

import (
	"fmt"
)

func expand(edges [][]int, oldPaths [][]int) [][]int {
	newPaths := make([][]int, 0)
	for _, e := range edges {
		for _, path := range oldPaths {
			var newPath []int
			if path[len(path)-1] == e[0] {
				newPath = make([]int, len(path)+1)
				copy(newPath, path)
				newPath[len(path)] = e[1]
				newPaths = append(newPaths, newPath)
			} 
		}
	}
	return newPaths
}

func main() {
	edges := [][]int{
		{1,2},
		{1,4},
		{2,1},
		{2,5},
		{3,2},
		{4,1},
		{5,3},
		{5,4},
	}
	paths := make([][][]int, 0)
	paths = append(paths, [][]int{{2},{4}})
	for i := 2; i <= 7; i++ {
		paths = append(paths, expand(edges, paths[i-2]))
		count := 0
		for _, path := range paths[len(paths)-1] {
			if path[len(path)-1] == 5 {
				count++
			}
		}
		fmt.Println(i, count)
	}
}
