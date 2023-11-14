using Microsoft.AspNetCore.Mvc;
using ReservationApp.Models;
using ReservationApp.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks; //Need to fix this one

[Route("api/v1/[controller]")]
[ApiController]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomsController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    // GET /api/v1/rooms
    [HttpGet("")]
    public async Task<ActionResult<IEnumerable<Room>>> GetAllRooms()
    {
        var rooms = await _roomService.GetAllRoomsAsync();
        return Ok(rooms);
    }

    // GET /api/v1/rooms/:Building/:Room/:Date/:Time
    [HttpGet("{building}/{room}/{date}/{time}")]
    public async Task<ActionResult<Room>> GetRoom(string building, string room, DateTime date, DateTime time)
    {
        _ = await _roomService.GetRoomAsync(building, room, date, time);
        if (room != null)
        {
            return Ok(room);
        }
        else
        {
            return NotFound();
        }
    }

    // Additional routes for different combinations of parameters
    [HttpGet("{building}/{room}/{date}")]
    public async Task<ActionResult<IEnumerable<Room>>> GetRoomsByBuildingRoomDate(string building, string room, DateTime date)
    {
        var rooms = await _roomService.FindRoomsAsync(building, room, date);
        return Ok(rooms);
    }

    [HttpGet("{building}/{room}")]
    public async Task<ActionResult<IEnumerable<Room>>> GetRoomsByBuildingRoom(string building, string room)
    {
        var rooms = await _roomService.FindRoomsAsync(building, room);
        return Ok(rooms);
    }

    [HttpGet("{building}")]
    public async Task<ActionResult<IEnumerable<Room>>> GetRoomsByBuilding(string building)
    {
        var rooms = await _roomService.FindRoomsAsync(building);
        return Ok(rooms);
    }
}
