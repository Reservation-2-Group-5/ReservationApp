using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ReservationApp.Services; 
using ReservationApp.Models;
using System.IO;
using Google.Protobuf.WellKnownTypes; //Will this work?

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers().AddJsonOptions(opts => opts.JsonSerializerOptions.PropertyNamingPolicy = null);






    builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});







builder.Services.AddScoped<IDeviceService, DeviceService>();
builder.Services.AddScoped<IDeviceResService, DeviceResService>();
builder.Services.AddScoped<IRoomResService, RoomResService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var dbPath = "../database/dev(1).sqlite3"; 
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));




var app = builder.Build();


    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseCors("AllowOrigin");
    app.UseAuthorization();
    app.MapControllers();
    app.Run();
