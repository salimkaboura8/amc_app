using Amc.Data;
using Amc.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Amc.Api.Controllers;

[ApiController]
[Route("orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrdersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.FirstName) ||
            string.IsNullOrWhiteSpace(req.LastName) ||
            string.IsNullOrWhiteSpace(req.PhoneNumber) ||
            req.NbOfItems <= 0 ||
            req.Date == default)
        {
            return BadRequest(new { error = "Missing or invalid fields." });
        }

        var order = new Order
        {
            FirstName = req.FirstName,
            LastName = req.LastName,
            PhoneNumber = req.PhoneNumber,
            Date = req.Date,
            NbOfItems = req.NbOfItems,
            Price = Math.Max(0m, req.NbOfItems * 4.99m),
            Status = OrderStatus.EN_COURS,
            Description = req.Description
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetAll(CancellationToken ct)
    {
        var orders = await _db.Orders.AsNoTracking().ToListAsync(ct);
        return Ok(orders);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById([FromRoute] int id, CancellationToken ct)
    {
        var order = await _db.Orders.FindAsync(new object?[] { id }, ct);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Order input, CancellationToken ct)
    {
        var order = await _db.Orders.FindAsync(new object?[] { id }, ct);
        if (order is null) return NotFound();

        order.FirstName = input.FirstName;
        order.LastName = input.LastName;
        order.PhoneNumber = input.PhoneNumber;
        order.Date = input.Date;
        order.NbOfItems = input.NbOfItems;
        order.Price = input.Price;
        order.Status = input.Status;
        order.Description = input.Description;

        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id, CancellationToken ct)
    {
        var order = await _db.Orders.FindAsync(new object?[] { id }, ct);
        if (order is null) return NotFound();

        _db.Orders.Remove(order);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpPost("{id:int}/accept")]
    public async Task<IActionResult> Accept([FromRoute] int id, CancellationToken ct)
    {
        var order = await _db.Orders.FindAsync(new object?[] { id }, ct);
        if (order is null) return NotFound();
        order.Status = OrderStatus.LIVREE; // 1
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpPost("{id:int}/refuse")]
    public async Task<IActionResult> Refuse([FromRoute] int id, CancellationToken ct)
    {
        var order = await _db.Orders.FindAsync(new object?[] { id }, ct);
        if (order is null) return NotFound();
        order.Status = OrderStatus.REFUSEE; // -1
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

}
