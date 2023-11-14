using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ReservationApp.Services; 
using ReservationApp.Models;
using System.IO;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();


    var dbPath = Path.Combine(builder.Environment.ContentRootPath, "dev.sqlite3");
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite($"Data Source={dbPath}"));


    builder.Services.AddScoped<IDeviceService, DeviceService>();
    builder.Services.AddScoped<IDeviceResService, DeviceResService>();
    builder.Services.AddScoped<IRoomResService, RoomResService>();


    var app = builder.Build();


    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseHttpsRedirection();
    app.UseAuthorization();
    app.MapControllers();
    app.Run();
}