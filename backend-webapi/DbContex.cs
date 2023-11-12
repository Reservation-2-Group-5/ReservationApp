using Microsoft.EntityFrameworkCore;
using Reservation.Models;
using ReservationApp.Models; 

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // DbSet properties for your models/entities
    public DbSet<User> Users { get; set; }
    public DbSet<Device> Devices { get; set; }
    public DbSet<DeviceRes> DeviceReservations { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<RoomRes> RoomReservations { get; set; }
    

    
}
