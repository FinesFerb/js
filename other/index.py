arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
def binary(arr, item):
  low = 0
  high = len(arr) - 1
  while  low <=  high:
    mid = (low + high)
    guess = arr[mid]
    if guess == item:
      return mid
    if guess > item:
      high = mid - 1
    else:
      low = mid + 1
    return None
  
print(binary(arr, 1))
print('geloo')