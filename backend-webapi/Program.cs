using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ReservationApp.Services; 
using ReservationApp.Models;
using System.IO;
using Google.Protobuf.WellKnownTypes; //Will this work?

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();



void ConfigureServices(IServiceCollection services)
{
    services.AddCors(c =>
    {
        c.AddPolicy("AllowOrigin", options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
    });

    services.AddControllers();
}

void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseRouting();

    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });

    
    }

var dbPath = Path.Combine(builder.Environment.ContentRootPath, "dev.sqlite3");
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite($"Data Source={dbPath}"));


    builder.Services.AddScoped<IDeviceService, DeviceService>();
    builder.Services.AddScoped<IDeviceResService, DeviceResService>();
    builder.Services.AddScoped<IRoomResService, RoomResService>();
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddControllers();


var app = builder.Build();


    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseAuthorization();
    app.MapControllers();
    app.Run();
