using Reservation.Controllers;
using ReservationApp.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReservationApp.Services
{
    public interface IRoomResService
    {
        Task<IEnumerable<RoomRes>> GetAllRoomReservationsAsync();
        Task<RoomRes> GetRoomReservationByIdAsync(int id);
        Task<RoomRes> CreateRoomReservationAsync(RoomRes roomRes);
        Task UpdateRoomReservationAsync(RoomRes roomRes);
        Task DeleteRoomReservationAsync(int id);
        Task GetAllRoomReservations();
        Task<RoomResController> GetAllAsync();
        Task<RoomResController> GetUserByNetIDAsync(int id);
        Task<RoomResController> DeleteAsync(int id);
        Task<RoomResController> SubmitAsync(RoomReservationDto roomReservationDto);
    }

    public interface IRoomService
    {
        Task<IEnumerable<Room>> GetAllRoomsAsync();
        Task<Room> GetRoomAsync(string building, string room, DateTime date, DateTime time);
  
        Task<IEnumerable<Room>> FindRoomsAsync(string building, string room, DateTime date);
        Task<IEnumerable<Room>> FindRoomsAsync(string building, string room);
        Task<IEnumerable<Room>> FindRoomsAsync(string building);
        Task UpdateRoomStatus(object building, object room, bool v, object value1, object value2);
    }
}
