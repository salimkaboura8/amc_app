namespace Backend.Models;

public class Order
{
    public int Id { get; set; }

    // A human-friendly order number/code (optional)
    public string? Number { get; set; }

    // Total amount for the order
    public decimal Total { get; set; }
}
