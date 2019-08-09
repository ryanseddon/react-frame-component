workflow "New workflow" {
  on = "push"
  resolves = ["test"]
}

action "test" {
  uses = "yarn"
  runs = "test"
}
