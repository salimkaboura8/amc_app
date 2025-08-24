namespace Backend.Models;

public class Order
{
    public int Id { get; set; }
    public string? Number { get; set; }
    public decimal Total { get; set; }
}
