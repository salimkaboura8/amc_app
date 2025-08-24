namespace Backend.Models;

public enum OrderStatus
{
    EN_COURS = 0,
    LIVREE = 1
}

public class Order
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public DateTime Date { get; set; }
    public int NbOfItems { get; set; }
    public decimal Price { get; set; }
    public OrderStatus Status { get; set; }
}
