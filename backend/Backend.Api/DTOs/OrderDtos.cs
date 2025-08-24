public record CreateOrderRequest(
    string FirstName,
    string LastName,
    string PhoneNumber,
    DateTime Date,
    int NbOfItems
);
