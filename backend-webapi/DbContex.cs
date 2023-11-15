using Microsoft.EntityFrameworkCore;
using Reservation.Models;
using ReservationApp.Models; //Should be good

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // DbSet properties for models/entities
    public DbSet<User> User { get; set; }
    public DbSet<Device> Device { get; set; }
    public DbSet<DeviceRes> Device_Res { get; set; }
    public DbSet<Room> Room { get; set; }
    public DbSet<RoomRes> Room_Res { get; set; }
    

    
}
