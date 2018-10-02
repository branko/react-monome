def mystery(list):
  for i in range(1, len(list)):
    pos = i
    current = list[i]

    while pos > 0 and list[pos-1] > current:
      list[pos] = list[pos-1]
      pos = pos - 1

    list[pos] = current

  return list

print(mystery([4,3,2,1]))